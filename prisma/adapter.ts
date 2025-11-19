import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * 解析 DATABASE_URL 并返回数据库连接配置
 * 支持的格式: mysql://user:password@host:port/database
 *
 * @param databaseUrl - 数据库连接 URL
 * @returns 解析后的数据库配置对象
 */
function parseDatabaseUrl(databaseUrl: string | undefined) {
  // 默认值
  const defaults = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "elysia_app",
    connectionLimit: 10,
  };

  if (!databaseUrl) {
    return defaults;
  }

  try {
    const url = new URL(databaseUrl);

    return {
      host: url.hostname || defaults.host,
      port: url.port ? parseInt(url.port, 10) : defaults.port,
      user: url.username || defaults.user,
      password: url.password || defaults.password,
      database: url.pathname ? url.pathname.slice(1) : defaults.database, // 移除前导斜杠
      connectionLimit: url.searchParams.get("connection_limit")
        ? parseInt(url.searchParams.get("connection_limit") || "10", 10)
        : defaults.connectionLimit,
    };
  } catch (error) {
    console.warn("解析 DATABASE_URL 失败，使用默认值:", error);
    return defaults;
  }
}

const DATABASE_URL = process.env.DATABASE_URL;
const dbConfig = parseDatabaseUrl(DATABASE_URL);

// Mysql 适配器
const mariadbAdapter = new PrismaMariaDb({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  connectionLimit: dbConfig.connectionLimit,
  connectTimeout: 60000,
});

export default mariadbAdapter;
