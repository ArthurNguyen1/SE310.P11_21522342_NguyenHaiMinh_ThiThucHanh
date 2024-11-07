using Microsoft.EntityFrameworkCore;
using NguyenHaiMinh_21522342_Test.Core.Entities;
using NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;
using NguyenHaiMinh_21522342_Test.Infrastructure.Data;

namespace NguyenHaiMinh_21522342_Test.Infrastructure.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId)
    {
        return await _context.Products
                             .Where(p => p.CategoryId == categoryId)
                             .ToListAsync();
    }
}
