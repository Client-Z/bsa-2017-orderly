const router = require('express').Router();
const R = require('ramda');
const tableRepository = require('../../repositories/table/tableRepository');
const baseRepository = require('../../repositories/base/baseRepository')
const {defaultTable, defaultViews} = require('../../config/defaultEntities');

const viewReps = {
    grid: require('../../repositories/view/gridRepositories'),
    form: require('../../repositories/view/formRepositories'),
    kanban: require('../../repositories/view/kanbanRepositories'),
    gallery: require('../../repositories/view/galleryRepositories')
};

let io;

// tables -------------------------------------
router.post('/', (request, response, next) => {
    let newTable = request.body || defaultTable();
    return Promise.all(
        [
            tableRepository.add(R.merge(newTable, request.body)),
            viewReps['grid'].add(defaultViews['grid'])
        ])
        .then(([table, view]) => tableRepository.addView(table._id, view._id, view.type))
        .then((table) => R.tap((table) => {
            io.emit('table:add:success', table);
        })(table))
        .then((table) => response.status(201).send(table))
        .catch((error) => {
            response.status(400);
            next(error);
        });
});

router.get('/ids/:ids', (request, response, next) => {
    tableRepository.getByIds(request.params.ids.split(':'))
        .then((tables) => response.status(200).send(tables))
        .catch((error) => {
            response.status(400);
            next(error);
        });
});

router.get('/:id', (request, response, next) => {
    tableRepository.getById(request.params.id)
        .then((table) => response.status(200).send(table))
        .catch((error) => {
            response.status(400);
            next(error);
        });
});

router.get('/', (request, response, next) => {
    tableRepository.getAll()
        .then((tables) => response.status(200).send(tables))
        .catch((error) => {
            response.status(400);
            next(error);
        });
});

router.put('/:id', (request, response, next) => {
    tableRepository.update(request.params.id, request.body)
        .then(R.tap((table) => {
            io.emit('table:update:success', table);
        }))
        .then((table) => response.status(200).send(table))
        .catch((error) => {
            response.status(400);
            next(error);
        });
});

router.put('/csv/:id', (request, response, next) => {
    tableRepository.uploadCSV(request.params.id, request.body.data, request.body.viewId, request.body.viewType)
        .then(R.tap((table) => {
            io.emit('table:update:success', table);
        }))
        .then((table) => response.status(200).send(table))
        .catch((error) => {
            response.status(400);
            next(error);
        });
});

router.delete('/:id', (request, response, next) => {
    tableRepository.remove(request.params.id)
        .then(() => baseRepository.deleteTableFromBase(request.params.id))
        .then(() => {
            io.emit('table:delete:success', request.params.id);
            return Promise.resolve({});
        })
        .then(() => response.sendStatus(204))
        .catch((error) => {
            response.status(400);
            next(error);
        });
});

// records -------------------------------------
router.get('/:id/records', (request, response) => {
    tableRepository.getRecords(request.params.id)
        .then((records) => response.status(200).send(records))
        .catch((err) => response.status(500).send(err));
});

router.get('/:id/records/:recordId', (request, response) => {
    tableRepository.getOneRecord(request.params.id, request.params.recordId)
        .then((result) => response.status(200).send(result))
        .catch((err) => response.status(500).send(err));
});

router.post('/:id/records', (request, response, next) => {
    tableRepository.addRecord(request.params.id, request.body)
        .then((result) => response.status(200).send(result))
        .catch((error) => {
            response.status(400);
            next(error);
        });
});

router.put('/:id/records', (request, response) => {
    tableRepository.updateRecords(request.params.id, request.body.data.data, request.body.data.currentView)
        .then((result) => response.status(200).send(result))
        .catch((err) => response.status(500).send(err));
});

router.delete('/:id/records/:recordId', (request, response) => {
    tableRepository.pullRecord(request.params.id, request.params.recordId)
        .then(R.tap((table) => {
            io.emit('record:delete:success', table);
        }))
        .then((result) => response.send(result))
        .catch((err) => response.sendStatus(500).send(err));
});

router.delete('/:tableId/records/:recordId/comments/:commentId', (req, res) => {
	tableRepository.pullComment(req.params.tableId, req.params.recordId, req.params.commentId)
		.then(table => res.status(204).send(table))
		.catch(err => response.sendStatus(500))
})

// fields -------------------------------------
router.get('/:id/fields', (request, response) => {
    tableRepository.getFields(request.params.id)
        .then((fields) => response.status(200).send(fields))
        .catch((err) => response.status(500).send(err));
});

router.get('/:id/fields/:fieldId', (request, response) => {
    tableRepository.getOneField(request.params.id, request.params.fieldId)
        .then((result) => response.status(200).send(result))
        .catch((err) => response.status(500).send(err));
});

router.post('/:id/fields', (request, response) => {
    tableRepository.addField(request.params.id, request.body.field, request.body.currentViewId)
        .then((table) => {
            const kanbanViews = R.filter(R.propEq('type', 'kanban'))(table.views);
            const addedField = R.last(table.fields);
            return Promise.all(R.map((view) => {
                viewReps['kanban'].addColumn(view._id, {field: addedField._id});
            })(kanbanViews)).then(() => table);
        })
        .then((result) => response.status(200).send(result))
        .catch((err) => response.status(500).send(err));
});

router.put('/:id/fields', (request, response) => {
    tableRepository.updateFields(request.params.id, request.body)
        .then(R.tap((table) => {
            io.emit('record:add:success', table);
        }))
        .then((result) => response.status(200).send(result))
        .catch((err) => response.status(500).send(err));
});

router.put('/:id/fields/:fieldId', (request, response) => {
    tableRepository.updateField(request.params.id, request.params.fieldId, request.body)
        .then(R.tap((table) => {
            io.emit('field:update:meta:success', table);
        }))
        .then((result) => response.status(200).send(result))
        .catch((err) => response.status(500).send(err));
});

router.delete('/:id/fields/:fieldId', (request, response) => {
    tableRepository.deleteField(request.params.id, request.params.fieldId, request.body.currentView)
        .then(R.tap((table) => {
            io.emit('field:delete:success', table);
        }))
        .then((result) => response.send(result))
        .catch((err) => response.sendStatus(500).send(err));
});

router.delete('/:id/fields', (request, response) => {
    tableRepository.deleteAllFields(request.params.id)
        .then((result) => response.send(result))
        .catch((err) => response.sendStatus(500).send(err));
});

// views -------------------------------------
router.get('/:id/views/:viewId', (request, response) => {
    tableRepository.getView(request.params.id, request.params.viewId)
        .then((tables) => response.status(200).send(tables))
        .catch((error) => response.status(500).send(error));
});

router.get('/:id/views/', (request, response) => {
    tableRepository.getViews(request.params.id)
        .then((tables) => response.status(200).send(tables))
        .catch((error) => response.status(500).send(error));
});

router.get('/:id/views/:viewId/:viewType', (request, response) => {
    tableRepository.getById(request.params.id, request.params.viewId)
        .then((table) => response.status(200).send(table))
        .catch((error) => response.status(500).send(error));
});

router.post('/:id/views', (request, response) => {
    const typeOfView = request.body.viewType;
    viewReps[typeOfView].add(defaultViews[typeOfView])
        .then((view) => tableRepository.addView(request.body.tableId, view._id, view.type))
        .then((result) => response.status(200).send(result))
        .catch((err) => response.status(500).send(err));
});

router.delete('/:id/views/:viewId/:viewType', (request, response) => {
    tableRepository.deleteView(request.params.id, request.params.viewId, request.params.viewType)
        .then((result) => response.status(200).send(result))
        .catch((err) => response.status(500).send(err));
});

router.put('/:id/views/:viewType/:viewId/fields/:fieldId', (request, response) => {
    tableRepository.updateView(
        request.params.id,
        request.params.viewId,
        request.params.viewType,
        request.params.fieldId,
        request.body.hidden)
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

// filter table -------------------------------------

router.get('/:id/views/:viewId/fields/filter', (request, response) => {
    tableRepository.performFilter(request.params.id, request.params.viewId)
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

router.post('/:id/views/:viewType/:viewId/fields/:fieldId/:fieldIndex/filters', (request, response) => {
    tableRepository.addFilter(
        request.params.id,
        request.params.viewId,
        request.params.viewType,
        request.params.fieldId,
        request.params.fieldIndex)
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

router.put('/:id/views/:viewType/:viewId/fields/:fieldId/:fieldIndex/filters/:filterId', (request, response) => {
    tableRepository.updateFilter(
        request.params.id,
        request.params.viewId,
        request.params.viewType,
        request.params.fieldId,
        request.params.fieldIndex,
        request.params.filterId,
        request.body.data.condition,
        request.body.data.query)
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

router.delete('/:id/views/:viewType/:viewId/filters/:filterId', (request, response) => {
    tableRepository.removeFilter(
        request.params.id,
        request.params.viewId,
        request.params.viewType,
        request.params.filterId)
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

router.delete('/:id/views/:viewType/:viewId/filters/', (request, response) => {
    tableRepository.removeAllFilters(
        request.params.id,
        request.params.viewId,
        request.params.viewType)
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

// sort table -------------------------------------

router.get('/:id/views/:viewId/fields/sorts', (request, response) => {
    tableRepository.performSort(request.params.id, request.params.viewId)
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

router.post('/:id/views/:viewType/:viewId/fields/:fieldId/sorts', (request, response) => {
    tableRepository.addSort(
        request.params.id,
        request.params.viewId,
        request.params.viewType,
        request.params.fieldId,
        request.body.sortOption
    )
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

router.put('/:id/views/:viewType/:viewId/fields/:fieldId/sorts/:sortId', (request, response) => {
    tableRepository.updateSort(
        request.params.id,
        request.params.viewId,
        request.params.viewType,
        request.params.fieldId,
        request.params.sortId,
        request.body.sortOption)
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

router.delete('/:id/views/:viewType/:viewId/sorts/:sortId', (request, response) => {
    tableRepository.removeSort(
        request.params.id,
        request.params.viewId,
        request.params.viewType,
        request.params.sortId)
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

router.delete('/:id/views/:viewType/:viewId/sorts', (request, response) => {
    tableRepository.removeAllSorts(
        request.params.id,
        request.params.viewId,
        request.params.viewType)
        .then((result) => response.status(200).send(result))
        .catch((error) => response.status(500).send(error));
});

module.exports = router;
module.exports.socketIO = function (importIO) {
    io = importIO;
};
