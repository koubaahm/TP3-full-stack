package fr.fullstack.shopapp.service;

import fr.fullstack.shopapp.model.Category;
import fr.fullstack.shopapp.model.Product;
import fr.fullstack.shopapp.repository.CategoryRepository;
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

    private final  CategoryRepository categoryRepository;

    @PersistenceContext
    private EntityManager em;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Ajouter une nouvelle catégorie à la base de données.
     */
    public Category createCategory(Category category) throws Exception {
        try {
            return categoryRepository.save(category);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Supprimer une catégorie par son ID, ainsi que ses relations avec les produits.
     */
    @Transactional
    public void deleteCategoryById(long id) throws Exception {
        try {
            Category category = getCategory(id);
            deleteNestedRelations(category);
            categoryRepository.deleteById(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Récupérer une catégorie par son ID.
     */
    public Category getCategoryById(long id) throws Exception {
        try {
            return getCategory(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Retourner une liste paginée des catégories, triée par ordre croissant d'ID.
     */
    public Page<Category> getCategoryList(Pageable pageable) {
        return categoryRepository.findByOrderByIdAsc(pageable);
    }

    /**
     * Met à jour une catégorie existante dans la base de données.
     */
    public Category updateCategory(Category category) throws Exception {
        try {
            getCategory(category.getId());
            return this.createCategory(category);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    /**
     * Supprimer les relations entre une catégorie et ses produits associés.
     */
    private void deleteNestedRelations(Category category) {
        List<Product> products = category.getProducts();
        for (Product product : products) {
            List<Category> categories = product.getCategories();
            categories.remove(category);
            product.setCategories(categories);
            em.merge(product);
            em.flush();
        }
    }

    /**
     * Récupèrer une catégorie par son ID (utilisé en interne).
     */
    private Category getCategory(Long id) throws Exception {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isEmpty()) {
            throw new Exception("Category with id " + id + " not found");
        }
        return category.get();
    }

}
