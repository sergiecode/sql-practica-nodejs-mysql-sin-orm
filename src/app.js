require('dotenv').config();
const express = require('express');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Profesores funcionando' });
});

// ALTA: Crear profesor
app.post('/profesores', async (req, res) => {
  try {
    const { nombre, email, materia } = req.body;
    
    // Query SQL directo para inserción
    const query = 'INSERT INTO profesores (nombre, email, materia) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [nombre, email, materia]);
    
    console.log('Query ejecutado:', query);
    console.log('Parámetros:', [nombre, email, materia]);
    
    res.status(201).json({
      message: 'Profesor creado exitosamente',
      id: result.insertId,
      profesor: { id: result.insertId, nombre, email, materia }
    });
  } catch (error) {
    console.error('Error al crear profesor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// LISTAR: Obtener todos los profesores
app.get('/profesores', async (req, res) => {
  try {
    // Query SQL directo para selección
    const query = 'SELECT * FROM profesores WHERE activo = 1';
    const [rows] = await db.execute(query);
    
    console.log('Query ejecutado:', query);
    
    res.json({
      message: 'Profesores obtenidos exitosamente',
      profesores: rows
    });
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// BAJA LÓGICA: Desactivar profesor
app.delete('/profesores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Query SQL directo para baja lógica
    const query = 'UPDATE profesores SET activo = 0 WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    
    console.log('Query ejecutado:', query);
    console.log('Parámetro ID:', id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    
    res.json({
      message: 'Profesor dado de baja exitosamente',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('Error al dar de baja profesor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// BAJA FÍSICA: Eliminar profesor permanentemente
app.delete('/profesores/:id/fisico', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Query SQL directo para eliminación física
    const query = 'DELETE FROM profesores WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    
    console.log('Query ejecutado:', query);
    console.log('Parámetro ID:', id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }
    
    res.json({
      message: 'Profesor eliminado permanentemente',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('Error al eliminar profesor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log('Endpoints disponibles:');
  console.log('- POST /profesores (alta)');
  console.log('- GET /profesores (listar activos)');
  console.log('- DELETE /profesores/:id (baja lógica)');
  console.log('- DELETE /profesores/:id/fisico (baja física)');
});