//(controller and route handlers for travel plans, including live weather integration)
import Plan from '../models/Plan.js';
import { getCityWeather } from '../services/weatherService.js';

export const createPlan = async (req, res, next) => {
  try {
    const { title, city, plan_date, notes } = req.body;

    if (!title || !city || !plan_date) {
      return res.status(400).json({ error: 'title, city, and plan_date are required.' });
    }

    const weather = await getCityWeather(city.trim());

    const plan = Plan.create({
      userId: req.user.id,
      title: title.trim(),
      city: weather.resolvedCity,
      planDate: plan_date,
      notes,
      weatherSummary: weather.weatherSummary,
      temperatureC: weather.temperatureC
    });

    res.status(201).json({
      message: 'Plan created with live weather data',
      plan,
      liveWeatherDetails: weather
    });
  } catch (err) {
    next(err);
  }
};

export const getPlans = (req, res, next) => {
  try {
    const plans = Plan.findAllByUser(req.user.id);
    res.status(200).json({ count: plans.length, plans });
  } catch (err) {
    next(err);
  }
};

export const getPlanById = async (req, res, next) => {
  try {
    const plan = Plan.findByIdAndUser(req.params.id, req.user.id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    // Also fetch fresh live weather when viewing a specific plan
    const cityNameOnly = plan.city.split(',')[0];
    const freshWeather = await getCityWeather(cityNameOnly);

    res.status(200).json({ plan, freshWeather });
  } catch (err) {
    next(err);
  }
};

export const updatePlan = async (req, res, next) => {
  try {
    const existing = Plan.findByIdAndUser(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    const title = req.body.title ? req.body.title.trim() : existing.title;
    const planDate = req.body.plan_date || existing.plan_date;
    const notes = req.body.notes !== undefined ? req.body.notes : existing.notes;

    let city = existing.city;
    let weatherSummary = existing.weather_summary;
    let temperatureC = existing.temperature_c;

    // Re-fetch weather if city changed
    if (req.body.city && req.body.city.trim() !== existing.city) {
      const weather = await getCityWeather(req.body.city.trim());
      city = weather.resolvedCity;
      weatherSummary = weather.weatherSummary;
      temperatureC = weather.temperatureC;
    }

    const updated = Plan.update(req.params.id, req.user.id, {
      title,
      city,
      planDate,
      notes,
      weatherSummary,
      temperatureC
    });

    res.status(200).json({ message: 'Plan updated', plan: updated });
  } catch (err) {
    next(err);
  }
};

export const deletePlan = (req, res, next) => {
  try {
    const deleted = Plan.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Plan not found.' });
    }
    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (err) {
    next(err);
  }
};