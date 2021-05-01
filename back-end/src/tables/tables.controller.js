const service = require('./tables.service');
const reservationService = require('../reservations/reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');


const checkId = async (req, res, next) => {
  const { table_id } = req.params;
  const data = await service.read(table_id);

  if (!data) {
    return next({ status: 404, message: `Table ID: ${table_id} was not found` });
  }

  res.locals.table = data;
  next();
}

const validateNewTable = async(req, res, next) => {
  if (!req.body.data) return next({ status: 400, message: 'Data Missing!' });

  const { table_name, capacity, reservation_id } = req.body.data;

  if (!table_name || table_name === '' || table_name.length === 1)
    return next({ status: 400, message: 'Invalid table_name' });

  if (!capacity || capacity === 0 || typeof capacity !== 'number')
    return next({ status: 400, message: 'Invalid capacity' });

  res.locals.newTable = { table_name, capacity };

  if (reservation_id) {
    res.locals.newTable.reservation_id = reservation_id;
    res.locals.newTable.occupied = true;
  }


  next();
}

const validateUpdate = async (req, res, next) => {
  if (!req.body.data) return next({ status: 400, message: 'Data Missing!' });

  const { reservation_id } = req.body.data;
  if (!reservation_id)
    return next({ status: 400, message: 'reservation_id is missing' });

  const reservation = await reservationService.read(reservation_id);
  if (!reservation)
    return next({ status: 404, message: `Reservation ${reservation_id} does not exist` });

  if (reservation.status === 'seated')
    return next({ status: 400, message: 'Guests are already seated' });

  res.locals.reservation = reservation;
  next();
}

const validateCapacity = async (req, res, next) => {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  const reservation = res.locals.reservation;

  if (table.capacity < reservation.people)
    return next({ status: 400, message: `Invalid capacity. ${table.table_name} is unable to seat ${reservation.people} people.` });

  if (table.occupied)
    return next({ status: 400, message: `${table.table_name} is currently occupied.` });

  next();
}

const list = async (req, res) => {
  const data = await service.list();

  res.json({ data: data });
}

const read = async (req, res) => {
  res.json({ data: res.locals.table });
}

const create = async (req, res) => {
  const data = await service.create(res.locals.newTable);

  res.status(201).json({ data: data[0] });
}

const update = async (req, res) => {
  const data = await service.update(req.params.table_id, res.locals.reservation.reservation_id);
  await reservationService.updateStatus(res.locals.reservation.reservation_id, 'seated');

  res.status(200).json({ data: data });
}

const destroy = async (req, res, next) => {
  const table = await service.read(req.params.table_id);

  if (!table.occupied)
    return next({ status: 400, message: `${table.table_name} is not occupied.` });

  const data = await service.destroy(table.table_id);
  await reservationService.updateStatus(table.reservation_id, 'finished');

  res.status(200).json({ data: data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(checkId), asyncErrorBoundary(read)],
  create: [asyncErrorBoundary(validateNewTable), asyncErrorBoundary(create)],
  update: [asyncErrorBoundary(validateUpdate), asyncErrorBoundary(validateCapacity), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(checkId), asyncErrorBoundary(destroy)]
};