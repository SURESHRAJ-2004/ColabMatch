import * as joinRequestService from '../services/joinRequestService.js';

export async function createJoinRequest(req, res, next) {
  try {
    const request = await joinRequestService.createJoinRequest(
      req.params.id,
      req.user.id,
      req.body.message
    );
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
}

export async function getProjectRequests(req, res, next) {
  try {
    const requests = await joinRequestService.getProjectJoinRequests(req.params.id, req.user.id);
    res.json(requests);
  } catch (err) {
    next(err);
  }
}

export async function respondToRequest(req, res, next) {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const result = await joinRequestService.respondToJoinRequest(
      req.params.requestId,
      req.user.id,
      action
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMyRequests(req, res, next) {
  try {
    const requests = await joinRequestService.getUserJoinRequests(req.user.id);
    res.json(requests);
  } catch (err) {
    next(err);
  }
}
