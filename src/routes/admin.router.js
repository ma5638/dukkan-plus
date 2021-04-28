const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroSequelize = require('@admin-bro/sequelize')

AdminBro.registerAdapter(AdminBroSequelize)

const dbadminbro = require('../database/models');

const adminBro = new AdminBro({
  databases: [dbadminbro],
  rootPath: '/admin',
  branding: {
    companyName: 'DUKKAN+',
    logo: false,
    softwareBrothers: false,
  },
})


const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'pass',
}

// const router = AdminBroExpress.buildRouter(adminBro)

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
        if (ADMIN.password === password && ADMIN.email === email){
            return ADMIN;
        }
        return null;
    },
    cookieName: process.env.ADMIN_COOKIE_NAME || 'adminbro',
    cookiePassword: process.env.ADMIN_COOKIE_PASS || 'somePassword',
})
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