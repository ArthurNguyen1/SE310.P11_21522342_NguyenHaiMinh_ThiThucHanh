# Use the official .NET 8 runtime as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5235

# Use the .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only the csproj file and restore dependencies
COPY ./backend/NguyenHaiMinh_21522342_Test/NguyenHaiMinh_21522342_Test.csproj ./NguyenHaiMinh_21522342_Test/
RUN dotnet restore "NguyenHaiMinh_21522342_Test/NguyenHaiMinh_21522342_Test.csproj"

# Copy the rest of the backend directory
COPY ./backend/NguyenHaiMinh_21522342_Test ./NguyenHaiMinh_21522342_Test
WORKDIR /src/NguyenHaiMinh_21522342_Test
RUN dotnet publish "NguyenHaiMinh_21522342_Test.csproj" -c Release -o /app/publish

# Final stage for runtime
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "NguyenHaiMinh_21522342_Test.dll"]
