package fr.fullstack.shopapp.service;

import fr.fullstack.shopapp.model.LocalizedProduct;
import fr.fullstack.shopapp.model.Product;
import fr.fullstack.shopapp.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Optional;


@Service
public class ProductService {
    @PersistenceContext
    private EntityManager em;

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Créer un nouveau produit après vérification de ses propriétés localisées.
     */
    @Transactional
    public Product createProduct(Product product) throws Exception {
        try {
            checkLocalizedProducts(product);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }

        try {
            Product newProduct = productRepository.save(product);
            em.flush();
            em.refresh(newProduct);
            return newProduct;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Supprimer un produit par son identifiant.
     */
    public void deleteProductById(long id) throws Exception {
        try {
            getProduct(id);
            productRepository.deleteById(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Récupérer un produit par son identifiant.
     */
    public Product getProductById(long id) throws Exception {
        try {
            return getProduct(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Récupèrer une liste paginée des produits d'une boutique avec des options de tri.
     */
    public Page<Product> getShopProductList(Optional<Long> shopId, Optional<Long> categoryId, Pageable pageable) {
        if (shopId.isPresent() && categoryId.isPresent()) {
            return productRepository.findByShopAndCategory(shopId.get(), categoryId.get(), pageable);
        }

        if (shopId.isPresent()) {
            return productRepository.findByShop(shopId.get(), pageable);
        }

        return productRepository.findByOrderByIdAsc(pageable);
    }

    /**
     * Met à jour un produit après vérification de ses propriétés.
     */
    @Transactional
    public Product updateProduct(Product product) throws Exception {
        try {
            getProduct(product.getId());
            return this.createProduct(product);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Vérifier que le produit contient au moins un nom localisé en français.
     */
    private void checkLocalizedProducts(Product product) throws Exception {
        Optional<LocalizedProduct> localizedProductFr = product.getLocalizedProducts()
                .stream().filter(o -> o.getLocale().equals("FR")).findFirst();

        if (localizedProductFr.isEmpty()) {
            throw new Exception("A name in french must be at least provided");
        }
    }

    /**
     * Récupérer un produit par son identifiant ou lève une exception s'il n'existe pas.
     */
    private Product getProduct(Long id) throws Exception {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) {
            throw new Exception("Product with id " + id + " not found");
        }
        return product.get();
    }
}
