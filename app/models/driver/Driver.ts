import { Instance, SnapshotIn, types } from "mobx-state-tree"

export const DriverModel = types
    .model("Driver")
    .props({
        name: types.maybeNull(types.string),
        driver_id: types.maybeNull(types.identifierNumber),
        employeeid: types.maybeNull(types.string)
    })

export interface Driver extends Instance<typeof DriverModel> { }

export interface DriverSnapshotIn extends SnapshotIn<typeof DriverModel> { }
