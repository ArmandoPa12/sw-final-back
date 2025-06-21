-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "planId" INTEGER;

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioMensual" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caracteristica" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Caracteristica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanCaracteristica" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "caracteristicaId" INTEGER NOT NULL,

    CONSTRAINT "PlanCaracteristica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suscripcion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),

    CONSTRAINT "Suscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_nombre_key" ON "Plan"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Caracteristica_nombre_key" ON "Caracteristica"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCaracteristica" ADD CONSTRAINT "PlanCaracteristica_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCaracteristica" ADD CONSTRAINT "PlanCaracteristica_caracteristicaId_fkey" FOREIGN KEY ("caracteristicaId") REFERENCES "Caracteristica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
