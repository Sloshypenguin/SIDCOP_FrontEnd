export const GlobalComponent = {
    // Api Calling
    API_URL: 'https://localhost:7071/',
    // API_URL : 'http://127.0.0.1:3000/',
    headerToken: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },

    // Auth Api
    AUTH_API: "https://localhost:7071/Usuarios/",
    // AUTH_API:"http://127.0.0.1:3000/auth/",


    // Products Api
    product: 'apps/product',
    productDelete: 'apps/product/',

    // Orders Api
    order: 'apps/order',
    orderId: 'apps/order/',

    // Customers Api
    customer: 'apps/customer',
}