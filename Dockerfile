# Usa una imagen base oficial de Node con pnpm
FROM node:18

# Instala pnpm globalmente
RUN npm install -g pnpm

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia solo archivos necesarios para instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Instala dependencias con seguridad (falla si el lockfile no coincide)
RUN pnpm install --frozen-lockfile

# Copia el resto del proyecto al contenedor
COPY . .

# Construye el proyecto (si usas TypeScript o tienes un build step)
RUN pnpm build

# Expone el puerto (ajusta si usas otro)
EXPOSE 3000

# Comando para iniciar tu app
CMD ["pnpm", "start"]
