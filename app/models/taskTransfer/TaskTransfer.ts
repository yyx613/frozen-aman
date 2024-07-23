import { types, SnapshotIn } from "mobx-state-tree";

export const TaskTransferDriverModel = types.
    model('TaskTransferDriver')
    .props({
        id: types.identifierNumber,
        employeeid: types.maybeNull(types.string),
        name: types.maybeNull(types.string)
    })

const DriverModel = types.
    model('Driver')
    .props({
        id: types.identifierNumber,
        employeeid: types.maybeNull(types.string),
        name: types.maybeNull(types.string)
    })

const Customer = types.model('Customer')
    .props({
        id: types.identifierNumber,
        code: types.maybeNull(types.string),
        company: types.maybeNull(types.string),
        phone: types.maybeNull(types.string),
        address: types.maybeNull(types.string)

    })

const Task = types.model('Task')
    .props({
        id: types.identifierNumber,
        date: types.maybeNull(types.string),
        customer: types.maybe(Customer)
    })

export const TaskTransferedListModel = types
    .model('TaskTransferedList')
    .props({
        id: types.identifierNumber,
        fromdriver: types.maybe(DriverModel),
        todriver: types.maybe(DriverModel),
        task: types.maybeNull(Task)
    })

export interface TaskTransferDriverSnapshotIn extends SnapshotIn<typeof TaskTransferDriverModel> { }
