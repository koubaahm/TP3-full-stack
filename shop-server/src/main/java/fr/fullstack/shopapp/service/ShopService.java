package fr.fullstack.shopapp.service;

import fr.fullstack.shopapp.model.OpeningHoursShop;
import fr.fullstack.shopapp.model.Product;
import fr.fullstack.shopapp.model.Shop;
import fr.fullstack.shopapp.repository.ShopRepository;
import fr.fullstack.shopapp.repository.ShopSearchRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShopService {
    @PersistenceContext
    private EntityManager em;


    private final ShopRepository shopRepository;

    private final ShopSearchRepository shopSearchRepository;

    public ShopService(ShopRepository shopRepository, ShopSearchRepository shopSearchRepository) {
        this.shopRepository = shopRepository;
        this.shopSearchRepository = shopSearchRepository;
    }

    /**
     * Créer une nouvelle boutique et vérifie les horaires d'ouverture.
     */
    @Transactional
    public Shop createShop(Shop shop) throws Exception {
        try {
            validateOpeningHours(shop.getOpeningHours());
            Shop newShop = shopRepository.save(shop);
            em.flush();
            em.refresh(newShop);
            return newShop;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Supprimer une boutique par son identifiant.
     */
    @Transactional
    public void deleteShopById(long id) throws Exception {
        try {
            Shop shop = getShop(id);
            deleteNestedRelations(shop);
            shopRepository.deleteById(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Récupérer une boutique par son identifiant.
     */
    public Shop getShopById(long id) throws Exception {
        try {
            return getShop(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Retourner une liste paginée des boutiques avec des options de tri et de filtre.
     */
    public Page<Shop> getShopList(
            Optional<String> sortBy,
            Optional<Boolean> inVacations,
            Optional<String> createdBefore,
            Optional<String> createdAfter,
            Pageable pageable
    ) {
        if (sortBy.isPresent()) {
            return switch (sortBy.get()) {
                case "name" -> shopRepository.findByOrderByNameAsc(pageable);
                case "createdAt" -> shopRepository.findByOrderByCreatedAtAsc(pageable);
                default -> shopRepository.findByOrderByNbProductsAsc(pageable);
            };
        }

        Page<Shop> shopList = getShopListWithFilter(inVacations, createdBefore, createdAfter, pageable);
        if (shopList != null) {
            return shopList;
        }

        return shopRepository.findByOrderByIdAsc(pageable);
    }

    /**
     * Recherche des boutiques en fonction de critères spécifiques.
     */
    public List<Shop> searchShops(
            Boolean inVacations,
            LocalDate startDate,
            LocalDate endDate,
            String name
    ) {
        if (inVacations == null && startDate == null && endDate == null && (name == null || name.isEmpty())) {
            return shopRepository.findAll();
        }

        return shopSearchRepository.searchShops(inVacations, startDate, endDate, name);
    }

    /**
     * Met à jour une boutique existante après validation des horaires.
     */
    @Transactional
    public Shop updateShop(Shop shop) throws Exception {
        try {
            validateOpeningHours(shop.getOpeningHours());
            getShop(shop.getId());
            return this.createShop(shop);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Supprimer les relations imbriquées des produits d'une boutique.
     */
    private void deleteNestedRelations(Shop shop) {
        List<Product> products = shop.getProducts();
        for (Product product : products) {
            product.setShop(null);
            em.merge(product);
            em.flush();
        }
    }

    /**
     * Récupérer une boutique par son identifiant.
     */
    private Shop getShop(Long id) throws Exception {
        Optional<Shop> shop = shopRepository.findById(id);
        if (shop.isEmpty()) {
            throw new Exception("Shop with id " + id + " not found");
        }
        return shop.get();
    }

    /**
     * Retourner une liste paginée de boutiques avec des filtres avancés.
     */
    private Page<Shop> getShopListWithFilter(
            Optional<Boolean> inVacations,
            Optional<String> createdAfter,
            Optional<String> createdBefore,
            Pageable pageable
    ) {
        if (inVacations.isPresent() && createdBefore.isPresent() && createdAfter.isPresent()) {
            return shopRepository.findByInVacationsAndCreatedAtGreaterThanAndCreatedAtLessThan(
                    inVacations.get(),
                    LocalDate.parse(createdAfter.get()),
                    LocalDate.parse(createdBefore.get()),
                    pageable
            );
        }

        if (inVacations.isPresent() && createdBefore.isPresent()) {
            return shopRepository.findByInVacationsAndCreatedAtLessThan(
                    inVacations.get(), LocalDate.parse(createdBefore.get()), pageable
            );
        }

        if (inVacations.isPresent() && createdAfter.isPresent()) {
            return shopRepository.findByInVacationsAndCreatedAtGreaterThan(
                    inVacations.get(), LocalDate.parse(createdAfter.get()), pageable
            );
        }

        if (inVacations.isPresent()) {
            return shopRepository.findByInVacations(inVacations.get(), pageable);
        }

        if (createdBefore.isPresent() && createdAfter.isPresent()) {
            return shopRepository.findByCreatedAtBetween(
                    LocalDate.parse(createdAfter.get()), LocalDate.parse(createdBefore.get()), pageable
            );
        }

        if (createdBefore.isPresent()) {
            return shopRepository.findByCreatedAtLessThan(
                    LocalDate.parse(createdBefore.get()), pageable
            );
        }

        return createdAfter.map(s -> shopRepository.findByCreatedAtGreaterThan(
                LocalDate.parse(s), pageable
        )).orElse(null);

    }

    /**
     * Valider les horaires d'ouverture pour éviter les chevauchements.
     */
    private void validateOpeningHours(List<OpeningHoursShop> openingHours) throws Exception {
        openingHours.stream()
                .collect(Collectors.groupingBy(OpeningHoursShop::getDay))
                .forEach((day, dayHours) -> {
                    dayHours.sort(Comparator.comparing(OpeningHoursShop::getOpenAt));

                    for (int i = 0; i < dayHours.size() - 1; i++) {
                        if (dayHours.get(i + 1).getOpenAt().isBefore(dayHours.get(i).getCloseAt())) {
                            throw new IllegalArgumentException(String.format(
                                    "Overlapping opening hours on day %d: %s-%s conflicts with %s-%s",
                                    day,
                                    dayHours.get(i).getOpenAt(), dayHours.get(i).getCloseAt(),
                                    dayHours.get(i + 1).getOpenAt(), dayHours.get(i + 1).getCloseAt()
                            ));
                        }
                    }
                });
    }
}
