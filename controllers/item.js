import ItemCategory from '../models/itemCategory.js';
import slugify from '../middleware/slugify.js';

const buildAncestors = async (id, parent_id) => {
    let ancest = [];
    try {
        let parentCategory = await ItemCategory.findOne(
            { _id: parent_id },
            { name: 1, slug: 1, ancestors: 1 }
        ).exec();
        if (parentCategory) {
            const { _id, name, slug } = parentCategory;
            ancest = [...parentCategory.ancestors];
            ancest.unshift({ _id, name, slug });
            await ItemCategory.findByIdAndUpdate(id, {
                $set: { ancestors: ancest }
            });
        }
    } catch (error) {
        if (!error.code) {
            error.code = 500;
        }
        throw error;
    }
};

const buildHierarchyAncestors = async (categoryId, parentId) => {
    if (categoryId && parentId) {
        buildAncestors(categoryId, parentId);
        const result = await ItemCategory.find({ parent: categoryId });
    }
    if (result) {
        result.forEach((doc) => {
            buildHierarchyAncestors(doc._id, categoryId);
        });
    }
};

export const addItemCategory = async (name, parentId) => {
    let parent = parentId ? parentId : null;
    const category = new ItemCategory({ name: name, parent });
    try {
        let newCategory = await category.save();
        buildAncestors(newCategory._id, parent);
        return newCategory._id;
    } catch (error) {
        if (!error.code) {
            error.code = 500;
        }
        throw error;
    }
};

export const getItemCategory = async (slug) => {
    try {
        const result = await ItemCategory.find({ slug: slug }).select({
            _id: false,
            name: true,
            'ancestors.slug': true,
            'ancestors.name': true
        });
        return result;
    } catch (error) {
        if (!error.code) {
            error.code = 500;
        }
        throw error;
    }
};

export const getItemCategoryDescendants = async (categoryId) => {
    try {
        const result = await ItemCategory.find({
            'ancestors._id': categoryId
        }).select({ _id: false, name: true });
        return result;
    } catch (error) {
        if (!error.code) {
            error.code = 500;
        }
        throw error;
    }
};

export const updateItemCategoryParent = async (categoryId, newParentId) => {
    const category = await ItemCategory.findByIdAndUpdate(categoryId, {
        $set: { parent: newParentId }
    });
    buildHierarchyAncestors(category._id, newParentId);
};

export const renameItemCategory = async (categoryId, categoryName) => {
    ItemCategory.findByIdAndUpdate(categoryId, {
        $set: { name: categoryName, slug: slugify(categoryName) }
    });
    ItemCategory.update(
        { 'ancestors._id': categoryId },
        {
            $set: {
                'ancestors.$.name': categoryName,
                'ancestors.$.slug': slugify(categoryName)
            }
        },
        { multi: true }
    );
};

export const deleteItemCategory = async (categoryId) => {
    err = await ItemCategory.findByIdAndRemove(categoryId);
    if (!err)
        result = await Category.deleteMany({ 'ancestors._id': categoryId });
};
