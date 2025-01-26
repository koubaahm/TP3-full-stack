package fr.fullstack.shopapp.service;

import fr.fullstack.shopapp.model.Shop;
import fr.fullstack.shopapp.repository.ShopSearchRepository;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.massindexing.MassIndexer;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ShopDataMigrationService implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(ShopDataMigrationService.class);


    private final EntityManager entityManager;

    public ShopDataMigrationService(ShopSearchRepository shopSearchRepository, EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    /**
     * Lancer une indexation massive des entités `Shop` au démarrage de l'application.
     */
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        try {
            SearchSession searchSession = Search.session(entityManager);
            MassIndexer massIndexer = searchSession.massIndexer(Shop.class)
                    .threadsToLoadObjects(4)
                    .batchSizeToLoadObjects(50)
                    .idFetchSize(150)
                    .transactionTimeout(20);

            logger.info("Démarrage de l'indexation massive des entités `Shop`...");
            massIndexer.startAndWait();
            logger.info("Indexation massive des entités `Shop` terminée avec succès.");
        } catch (Exception e) {
            logger.error("Erreur lors de l'indexation massive des entités `Shop`", e);
            throw e;
        }
    }

}