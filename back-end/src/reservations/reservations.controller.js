const service = require('./reservations.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

const checkId = async(req, res, next) => {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);

  if (!data) {
    return next({ status: 404, message: `Reservation ID: ${reservation_id} was not found` });
  }

  res.locals.reservation = data;
  next();
}

const validateNewReservation = async(req, res, next) => {
  if (!req.body.data) return next({ status: 400, message: 'Data Missing!' });

  const { first_name, last_name, mobile_number, people, reservation_date, reservation_time, status } = req.body.data;

  if (!first_name) {
    return next({ status: 400, message: 'Add customer first_name!' });
  }

  if (!last_name){
    return next({ status: 400, message: 'Add customer last_name!' });
  }

  if (!mobile_number){
    return next({ status: 400, message: 'Add customer mobile_number!' });
  }

  if (!people){
    return next({ status: 400, message: 'Add number of people!' });
  }

  if (!reservation_date){
    return next({ status: 400, message: 'Add a reservation_date!' });
  }

  if (!reservation_time){
    return next({ status: 400, message: 'Add a reservation_time!' });
  }

  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/)){
    return next({ status: 400, message: `Invalid reservation_date!` });
  }

  if (!reservation_time.match(/\d{2}:\d{2}/)){
    return next({ status: 400, message: 'Invalid reservation_time!' });
  }

  if (typeof people !== 'number'){
    return next({ status: 400, message: 'Number not given for people!' });
  }

  if (status === 'seated'){
    return next({ status: 400, message: 'Invalid! Status cannot be seated.' });
  }

  if (status === 'finished'){
    return next({ status: 400, message: 'Invalid! Status cannot be finished.' });
  }

  res.locals.reservation = { first_name, last_name, mobile_number, people, reservation_date, reservation_time };
  next();
}


const dateValidator = async(req, res, next) => {
  const date = new Date(res.locals.reservation.reservation_date);
  const currentDate = new Date();

  if (date.getUTCDay() === 2) {
    return next({ status: 400, message: "Restaurant is closed on Tuesdays!" });
  }

  if (date.valueOf() < currentDate.valueOf() && date.toUTCString().slice(0, 16) !== currentDate.toUTCString().slice(0, 16)) {
    return next({ status: 400, message: "Reservations should be made in the future!" });
  }

  next();
}

const timeValidator = async(req, res, next) => {
  const time = res.locals.reservation.reservation_time;
  let hour = Number(time[0] + time[1]);
  let minutes = Number(time[3] + time[4]);

  const currentTime = req.body.data.current_time;
  const date = new Date(res.locals.reservation.reservation_date);
  const currentDate = new Date();

  if (currentTime > time && date.toUTCString().slice(0, 16) === currentDate.toUTCString().slice(0, 16)) {
    return next({ status: 400, message: "Invalid time as it has already passed!" });
  }

  if (hour < 10 || (hour <= 10 && minutes < 30)) {
    return next({ status: 400, message: "Restaurant is closed at this time." });
  }

  if (hour > 21 || (hour >= 21 && minutes > 30)) {
    return next({ status: 400, message: "Restaurant is unavailable to serve due to time being near/after closing." });
  }

  next();
}

const validateStatusUpdate = async(req, res, next) => {
  const currentStatus = res.locals.reservation.status;
  const { status } = req.body.data;

  if (currentStatus === "finished") {
    return next({ status: 400, message: "Reservation is finished and cannot be updated." });
  }

  if (status === "cancelled") {
    return next();
  }

  if (status !== "booked" && status !== "seated" && status !== "finished") {
    return next({ status: 400, message: "Status is unknown and cannot be updated." });
  }

  next();
}

const validateUpdate = (req, res, next) => {
  if (!req.body.data) return next({ status: 400, message: 'Data Missing!' });

  const { first_name, last_name, mobile_number, people, reservation_date, reservation_time } = req.body.data;

  if (!first_name) {
    return next({ status: 400, message: 'Add customer first_name!' });
  }

  if (!last_name){
    return next({ status: 400, message: 'Add customer last_name!' });
  }

  if (!mobile_number){
    return next({ status: 400, message: 'Add customer mobile_number!' });
  }

  if (!people){
    return next({ status: 400, message: 'Add number of people!' });
  }

  if (!reservation_date){
    return next({ status: 400, message: 'Add a reservation_date!' });
  }

  if (!reservation_time){
    return next({ status: 400, message: 'Add a reservation_time!' });
  }

  if (!reservation_date.match(/\d{4}-\d{2}-\d{2}/)){
    return next({ status: 400, message: `Invalid reservation_date!` });
  }

  if (!reservation_time.match(/\d{2}:\d{2}/)){
    return next({ status: 400, message: 'Invalid reservation_time!' });
  }

  if (typeof people !== 'number'){
    return next({ status: 400, message: 'Number not given for people!' });
  }

  res.locals.reservation = { first_name, last_name, mobile_number, people, reservation_date, reservation_time };
  next();
}

const list = async (req, res) => {
  const { date, mobile_number } = req.query;

  if (date) {
    const data = await service.list(date);
    res.json({ data: data });
    return;
  }

  if (mobile_number) {
    const data = await service.listByMobileNumber(mobile_number);
    res.json({ data: data });
    return;
  } else {
    res.json({ data: [] });
  }

}

const read = async(req, res) => {
  res.status(200).json({ data: res.locals.reservation });
}

const create = async (req, res) => {
  const data = await service.create(res.locals.reservation);
  res.status(201).json({ data: data[0] });
}

const updateStatus = async (req, res) => {
  const { reservation_id } = req.params;
  const status = req.body.data.status;
  const data = await service.updateStatus(reservation_id, status);

  res.status(200).json({ data: { status: data[0] } });
}

const update = async (req, res) => {
  const { reservation_id } = req.params;
  const data = await service.update(reservation_id, res.locals.reservation);
  res.status(200).json({ data: data[0] });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(checkId), asyncErrorBoundary(read)],
  create: [asyncErrorBoundary(validateNewReservation), asyncErrorBoundary(dateValidator), asyncErrorBoundary(timeValidator), asyncErrorBoundary(create)],
  updateStatus: [asyncErrorBoundary(checkId), asyncErrorBoundary(validateStatusUpdate), asyncErrorBoundary(updateStatus)],
  update: [asyncErrorBoundary(checkId), asyncErrorBoundary(validateUpdate), asyncErrorBoundary(dateValidator), asyncErrorBoundary(timeValidator), asyncErrorBoundary(update)]
};
 