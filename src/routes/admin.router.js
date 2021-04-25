const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroSequelize = require('@admin-bro/sequelize')

AdminBro.registerAdapter(AdminBroSequelize)

const dbadminbro = require('../database/models');

const adminBro = new AdminBro({
  databases: [dbadminbro],
  rootPath: '/admin',
})


const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'password',
}

const router = AdminBroExpress.buildRouter(adminBro)
/*, {
    cookieName: process.env.ADMIN_COOKIE_NAME || 'admin',
    cookiePassword: process.env.ADMIN_COOKIE_PASS || 'password',
    authenticate: async (email, password) => {
        if (email === ADMIN.email && ADMIN.password === ADMIN.password){
            return ADMIN
        }
        return null
    }
})
*/

module.exports = router