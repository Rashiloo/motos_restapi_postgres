const models = require("../database/models");

// Crear una nueva moto
const createMoto = async (req, res) => {
  try {
    const moto = await models.Moto.create(req.body);
    return res.status(201).json({
      moto
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtener todas las motos
const getAllMotos = async (req, res) => {
  console.log('Obteniendo todas las motos');
  try {
    const motos = await models.Moto.findAll({
      include: [
        // Aquí puedes incluir relaciones si las tienes
      ]
    });
    return res.status(200).json({ motos });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// Obtener una moto por ID
const getMotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const moto = await models.Moto.findByPk(id, {
      include: [
        // Relaciones si aplican
      ]
    });
    
    if (!moto) {
      return res.status(404).json({ error: 'Moto no encontrada' });
    }
    
    return res.status(200).json({ moto });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// Actualizar una moto
const updateMoto = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await models.Moto.update(req.body, {
      where: { id }
    });
    
    if (updated) {
      const updatedMoto = await models.Moto.findByPk(id);
      return res.status(200).json({ moto: updatedMoto });
    }
    
    return res.status(404).json({ error: 'Moto no encontrada' });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// Eliminar una moto
const deleteMoto = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await models.Moto.destroy({
      where: { id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Moto no encontrada' });
    }
    
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  createMoto,
  getAllMotos,
  getMotoById,
  updateMoto,
  deleteMoto
};
