import { flow, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { TaskTransferDriverModel, TaskTransferedListModel } from "./TaskTransfer"
import { TaskModel } from "../task/Task"
import { callAddTaskTransfer, callTaskTransferDriver, callTaskTransferredList } from "app/services/api/task"
import { Alert } from "react-native"

export const TaskTransferStore = types
    .model("TaskTransferStore")
    .props({
        drivers: types.array(TaskTransferDriverModel),
        taskTransferredList: types.array(TaskTransferedListModel),
        selectedDriver: types.maybeNull(types.reference(TaskTransferDriverModel)),
        selectedTaskList: types.array(types.reference(TaskModel)),
        isLoading: true,
    })
    .views((self) => ({
        getSelectedTaskList(id) {
            if (!self.selectedTaskList) return false
            return !!self.selectedTaskList?.find(item => item.id === id)
        },
        filterDriverByName(text) {
            if (!text) return self.drivers
            return self.drivers?.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()))
        },
        getTaskTransferedById(id) {
            return self.taskTransferredList.find((item) => item.id === id)
        }
    }))
    .actions(withSetPropAction)
    .actions((self) => {

        function markLoading(loading) {
            self.isLoading = loading
        }

        function updateSelectedDriver(driver: any) {
            self.selectedDriver = driver
        }

        function updateSelectedTask(task) {
            if (!task) return
            const foundCustomer = self.selectedTaskList.find(item => item.id === task.id)
            if (foundCustomer) {
                self.selectedTaskList.remove(task)
                return
            }
            self.selectedTaskList.push(task)
        }

        const loadDriver = flow(function* loadDriver() {
            markLoading(true)
            const response = yield callTaskTransferDriver()

            if (response.kind !== 'ok') {
                console.tron.error(`Error fetching task list: ${JSON.stringify(response)}`, [])
                self.setProp('drivers', [])
                markLoading(false)
                Alert.alert(response.message)
                return response
            }

            self.setProp('drivers', response.data)
            markLoading(false)
            return response
        })


        const loadTaskTransferredList = flow(function* loadTaskTransferredList() {
            markLoading(true)
            const response = yield callTaskTransferredList()
            console.log('taskTransfer', response)

            if (response.kind !== 'ok') {
                console.tron.error(`Error fetching task list: ${JSON.stringify(response)}`, [])
                self.taskTransferredList.clear()
                markLoading(false)
                Alert.alert(response.message)
                return response
            }

            self.setProp('taskTransferredList', response.data)
            markLoading(false)
            return response
        })

        const submitTaskTransfer = flow(function* submitTaskTransfer() {
            markLoading(true)
            const response = yield callAddTaskTransfer({
                driverId: self.selectedDriver.id,
                transferDetail: formatTaskTransferList(self.selectedTaskList)
            })

            if (response.kind !== 'ok') {
                console.tron.error(`Error fetching task list: ${JSON.stringify(response)}`, [])
                return response
            }


            markLoading(false)
            return response
        })

        function reset() {
            self.selectedDriver = undefined
            self.selectedTaskList.clear()
            self.drivers.clear()
            self.taskTransferredList.clear()
        }



        return {
            updateSelectedDriver,
            updateSelectedTask,
            submitTaskTransfer,
            loadTaskTransferredList,
            loadDriver,
            reset
        }
    })

function formatTaskTransferList(list) {
    return list.map((item) => ({
        task_id: item.id
    }))
}
