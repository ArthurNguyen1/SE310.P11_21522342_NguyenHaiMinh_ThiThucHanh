using NguyenHaiMinh_21522342_Test.Core.Entities;

namespace NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;

public interface ICategoryRepository : IRepository<Category>
{
    Task<Category> GetCategoryWithProductsAsync(int categoryId);
}
