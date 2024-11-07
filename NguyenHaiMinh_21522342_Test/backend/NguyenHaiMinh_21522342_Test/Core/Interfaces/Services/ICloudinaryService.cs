using CloudinaryDotNet.Actions;

namespace NguyenHaiMinh_21522342_Test.Core.Interface.Services;

public interface ICloudinaryService
{
    Task<ImageUploadResult> UploadImageAsync(IFormFile file);
    Task<DeletionResult> DeleteImageAsync(string publicId);
}

