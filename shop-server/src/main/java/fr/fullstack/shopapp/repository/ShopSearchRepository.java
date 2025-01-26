package fr.fullstack.shopapp.repository;

import fr.fullstack.shopapp.model.Shop;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;

@Repository
public class ShopSearchRepository {

    private final EntityManager entityManager;

    public ShopSearchRepository(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public List<Shop> searchShops(
            Boolean inVacations,
            LocalDate startDate,
            LocalDate endDate,
            String name
    ) {
        SearchSession searchSession = Search.session(entityManager);

        return searchSession.search(Shop.class)
                .where(f -> {
                    var predicateBuilder = f.bool();

                    // Recherche sur le nom avec simpleQueryString
                    if (name != null && !name.isEmpty()) {
                        predicateBuilder.must(
                                f.simpleQueryString()
                                        .field("name") // Champ analysé
                                        .matching("\"" + name + "\"") // Recherche stricte de la phrase
                        );
                    }

                    // Filtrer par inVacations
                    if (inVacations != null) {
                        predicateBuilder.must(
                                f.match()
                                        .field("inVacations")
                                        .matching(inVacations)
                        );
                    }

                    // Filtrer par plage de dates
                    if (startDate != null && endDate != null) {
                        predicateBuilder.must(
                                f.range()
                                        .field("createdAt")
                                        .between(startDate, endDate)
                        );
                    } else if (startDate != null) {
                        predicateBuilder.must(
                                f.range()
                                        .field("createdAt")
                                        .atLeast(startDate)
                        );
                    } else if (endDate != null) {
                        predicateBuilder.must(
                                f.range()
                                        .field("createdAt")
                                        .atMost(endDate)
                        );
                    }

                    return predicateBuilder;
                })
                .fetchHits(1000);
    }


}