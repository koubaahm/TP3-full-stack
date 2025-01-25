package fr.fullstack.shopapp.service;

import fr.fullstack.shopapp.model.Shop;
import fr.fullstack.shopapp.repository.ShopSearchRepository;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.massindexing.MassIndexer;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ShopDataMigrationService implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(ShopDataMigrationService.class);

    @Autowired
    private ShopSearchRepository shopSearchRepository;

    @Autowired
    private EntityManager entityManager;

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

            logger.info("Starting mass indexing of Shop entities...");
            massIndexer.startAndWait();

            logger.info("Mass indexing of Shop entities completed successfully.");
        } catch (Exception e) {
            logger.error("Error during mass indexing of Shop entities", e);
            throw e;
        }
    }
}