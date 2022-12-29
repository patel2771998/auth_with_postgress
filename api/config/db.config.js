
module.exports = {
    HOST: "localhost",
    port: '3306',
    USER: "postgres",
    PASSWORD: "123",
    DB: "didtest",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    limit : 10,
    max_file_size : 5 * 1024 * 1024,
    url : 'http://localhost:3000/' + 'public/'
};