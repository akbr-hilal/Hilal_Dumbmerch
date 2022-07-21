"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert(
            "users",
            [
                {
                    email: "al@mail.com",
                    password:
                        "$2b$10$wyNjBKHeXSYXU37IpKjzme4iDDpn9Dw/WRvqEBCFvUCdzFvYHf/PC", //121202
                    name: "Alamanda",
                    status: "admin",
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
