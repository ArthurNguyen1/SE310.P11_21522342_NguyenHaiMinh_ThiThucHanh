using NguyenHaiMinh_21522342_Test.Core.Entities;

namespace NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;

public interface IProductRepository : IRepository<Product>
{
    Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);
}
