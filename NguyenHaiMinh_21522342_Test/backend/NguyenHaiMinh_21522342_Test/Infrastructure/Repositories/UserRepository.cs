using Microsoft.EntityFrameworkCore;
using NguyenHaiMinh_21522342_Test.Core.Entities;
using NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;
using NguyenHaiMinh_21522342_Test.Infrastructure.Data;

namespace NguyenHaiMinh_21522342_Test.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<User> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
                             .FirstOrDefaultAsync(u => u.Username == username);
    }
}
