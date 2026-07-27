# 🚨 RUNBOOK – Milbox Hypervisor Simulator

**Versión:** 1.0.0  
**Última actualización:** 2026-07-26  
**Responsable:** Rafael Mendez / José Perozo  

## 🔍 Fase #1: Diagnóstico (Verificación de Salud)

### 1.1 Frontend (Aplicación Web)
- URL de producción: `https://proyecto-milvirt-box.vercel.app`
- Consola del navegador (F12) para ver errores.
- Verificar sesión en `localStorage`.

### 1.2 Backend (API intermedia – si está desplegada)
- Health check: `curl http://localhost:3001/diag/health`
- Ready check: `curl http://localhost:3001/diag/ready`
- Métricas: `curl http://localhost:3001/diag/metrics`

### 1.3 Base de Datos (Supabase)
- Panel: `https://app.supabase.com/project/[TU_PROJECT_ID]`
- SQL: `SELECT COUNT(*) FROM messages;`
- Estado: `https://status.supabase.com/`

---

## 🛑 Fase #2: Protocolo ante Caídas (Contención de Incidentes)

### Nivel L1 – Usuario
1. Refrescar página (F5)
2. Limpiar caché (Ctrl+Shift+Delete)
3. Probar en modo incógnito
4. Verificar conexión a Internet
5. Reportar error con Correlation ID

### Nivel L2 – Soporte Técnico
1. Revisar logs del frontend (consola)
2. Verificar variables de entorno en Vercel
3. Revisar logs del backend (si existe)
4. Verificar políticas RLS en Supabase
5. Revisar deployment más reciente

### Nivel L3 – Desarrollador
1. Clonar repositorio y ejecutar local
2. Ejecutar `npm run test`
3. Reproducir error y capturar logs
4. Abrir issue en GitHub con Correlation ID

---

## 📦 Estrategia de Respaldo y Recuperación (Regla 3‑2‑1)
- **3 copias**: Supabase, exportación SQL diaria, archivo local.
- **2 soportes**: Supabase y archivos planos.
- **1 copia fuera del sitio**: backup automático de Supabase.

### Métricas de Recuperación
- **RTO**: 15 minutos
- **RPO**: 5 minutos

---

## 📊 Endpoints de Diagnóstico (Backend)
- `/diag/health` – Estado básico
- `/diag/ready` – Dependencias listas
- `/diag/metrics` – Métricas de memoria/CPU (restringido)

---

## 🧪 Comandos de Verificación Rápida
- `npm run test` – Pruebas unitarias
- `npm run lint` – Estilo de código
- `npm run doc` – Documentación JSDoc
- `curl -I https://proyecto-milvirt-box.vercel.app` – Verificar frontend

---

## 📌 Contactos y Escalación
- L1: Usuario
- L2: Administrador del sistema
- L3: Desarrollador líder (rafaelmendzg@gmail.com)
- Soporte Supabase: https://supabase.com/support