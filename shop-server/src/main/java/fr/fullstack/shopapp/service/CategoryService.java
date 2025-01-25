package fr.fullstack.shopapp.service;

import fr.fullstack.shopapp.model.Category;
import fr.fullstack.shopapp.model.Product;
import fr.fullstack.shopapp.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @PersistenceContext
    private EntityManager em;

    /**
     * Ajoute une nouvelle catégorie à la base de données.
     */
    public Category createCategory(Category category) throws Exception {
        try {
            return categoryRepository.save(category);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Supprime une catégorie par son ID, ainsi que ses relations avec les produits.
     */
    @Transactional
    public void deleteCategoryById(long id) throws Exception {
        try {
            Category category = getCategory(id);
            deleteNestedRelations(category); // Supprime les relations avec les produits.
            categoryRepository.deleteById(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Récupère une catégorie par son ID.
     */
    public Category getCategoryById(long id) throws Exception {
        try {
            return getCategory(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Retourne une liste paginée des catégories, triée par ordre croissant d'ID.
     */
    public Page<Category> getCategoryList(Pageable pageable) {
        return categoryRepository.findByOrderByIdAsc(pageable);
    }

    /**
     * Met à jour une catégorie existante dans la base de données.
     */
    public Category updateCategory(Category category) throws Exception {
        try {
            getCategory(category.getId()); // Vérifie que la catégorie existe.
            return this.createCategory(category); // Enregistre les nouvelles données.
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Supprime les relations entre une catégorie et ses produits associés.
     */
    private void deleteNestedRelations(Category category) {
        List<Product> products = category.getProducts();
        for (Product product : products) {
            List<Category> categories = product.getCategories();
            categories.remove(category); // Retire la catégorie de chaque produit.
            product.setCategories(categories);
            em.merge(product); // Met à jour le produit dans la base de données.
            em.flush(); // Synchronise les changements.
        }
    }

    /**
     * Récupère une catégorie par son ID (utilisé en interne).
     */
    private Category getCategory(Long id) throws Exception {
        Optional<Category> category = categoryRepository.findById(id);
        if (!category.isPresent()) {
            throw new Exception("Category with id " + id + " not found");
        }
        return category.get();
    }

}
