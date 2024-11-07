using NguyenHaiMinh_21522342_Test.Core.Entities;

namespace NguyenHaiMinh_21522342_Test.Core.Interface.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User> GetUserByUsernameAsync(string username);
}
