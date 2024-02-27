import Outfit from '../models/outfit.js';

export const createOutfit = async (req, res) => {
  try {
    const { title, description, image, items, hide, sku } = req.body;
    const newOutfit = await Outfit.create({
      title,
      sku,
      description,
      image,
      items,
      hide,
    });
    return res.status(200).json(newOutfit);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getOutfit = async (req, res) => {
  try {
    const outfitId = req.params.id;
    const outfit = await Outfit.findById(outfitId).populate("items");
    return res.status(200).json(outfit);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.find().populate("items");
    return res.status(200).json(outfit);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateOutfit = async (req, res) => {
  try {
    const outfitId = req.params.id;
    const updatedFields = req.body;
    const updatedOutfit = await Outfit.findByIdAndUpdate(
      outfitId,
      updatedFields,
      { new: true }
    );
    return res.status(200).json(updatedOutfit);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOutfit = async (req, res) => {
  try {
    const outfitId = req.params.id;
    const deletedOutfit = await Outfit.findByIdAndDelete(outfitId);
    return res.status(200).json(deletedOutfit);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
