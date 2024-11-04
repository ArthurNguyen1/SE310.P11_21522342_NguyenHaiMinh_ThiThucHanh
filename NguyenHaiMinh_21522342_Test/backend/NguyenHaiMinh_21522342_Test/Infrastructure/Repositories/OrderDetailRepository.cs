using Microsoft.EntityFrameworkCore;
using NguyenHaiMinh_21522342_Test.Core.Entities;
using NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;
using NguyenHaiMinh_21522342_Test.Infrastructure.Data;

namespace NguyenHaiMinh_21522342_Test.Infrastructure.Repositories;

public class OrderDetailRepository : Repository<OrderDetail>, IOrderDetailRepository
{
    private readonly ApplicationDbContext _context;

    public OrderDetailRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderDetail>> GetOrderDetailsByOrderAsync(int orderId)
    {
        return await _context.OrderDetails
                             .Where(od => od.OrderId == orderId)
                             .ToListAsync();
    }
}
