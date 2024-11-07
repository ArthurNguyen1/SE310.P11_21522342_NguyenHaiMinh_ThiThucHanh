using Microsoft.EntityFrameworkCore;
using NguyenHaiMinh_21522342_Test.Core.Entities;
using NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;
using NguyenHaiMinh_21522342_Test.Infrastructure.Data;

namespace NguyenHaiMinh_21522342_Test.Infrastructure.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    private readonly ApplicationDbContext _context;

    public CategoryRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<Category> GetCategoryWithProductsAsync(int categoryId)
    {
        return await _context.Categories
                             .Include(c => c.Products)
                             .FirstOrDefaultAsync(c => c.CategoryId == categoryId);
    }
}
