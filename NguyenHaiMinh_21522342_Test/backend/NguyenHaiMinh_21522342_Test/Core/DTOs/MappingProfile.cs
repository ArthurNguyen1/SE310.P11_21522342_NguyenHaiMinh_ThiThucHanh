using AutoMapper;
using NguyenHaiMinh_21522342_Test.Core.Entities;

namespace NguyenHaiMinh_21522342_Test.Core.DTOs;


public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<UserCreateDto, User>();
        CreateMap<User, UserCreateDto>();

        // Product mappings
        CreateMap<ProductCreateDto, Product>();
        CreateMap<Product, ProductCreateDto>();

        // Category mappings
        CreateMap<CategoryCreateDto, Category>();
        CreateMap<Category, CategoryCreateDto>();

        // Order mappings
        CreateMap<OrderCreateDto, Order>();
        CreateMap<Order, OrderCreateDto>();

        // OrderDetail mappings
        CreateMap<OrderDetailCreateDto, OrderDetail>();
        CreateMap<OrderDetail, OrderDetailCreateDto>();

        // User register and login mappings (only map to User, not from it)
        CreateMap<UserRegisterDto, User>();
        CreateMap<UserLoginDto, User>();
    }
}