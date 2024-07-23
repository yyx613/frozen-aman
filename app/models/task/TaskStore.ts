import { flow, types } from "mobx-state-tree"
import { TaskModel } from "./Task"
import { callTask } from "app/services/api/task"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { Alert } from "react-native"

export const TaskStore = types.
    model('TaskStore')
    .props({
        task: types.array(TaskModel),
        isLoading: false,
    })
    .views((self) => ({
        filterTaskByName(text) {
            if (!text) return self.task
            return self.task.filter((item) => item.customer.company.toLowerCase().includes(text.toLowerCase()))

        },
        getDeliveryProgress() {
            if (self.task?.length === 0) return 0
            const totalComplete = self.task
                .reduce((total, task) => (task.status === 8 ? total + 1 : total), 0)
            return totalComplete / self.task.length
        },
        getSelectedTask(taskId) {
            return self.task.find((task) => task.id === taskId)
        }
    }))
    .actions(withSetPropAction)

    .actions((self) => {
        function markLoading(loading) {
            self.isLoading = loading
        }

        function resetTask() {
            self.task.clear()
        }

        const loadTask = flow(function* loadTask() {
            markLoading(true)
            const response = yield callTask()
            if (response.kind !== 'ok') {
                console.tron.error(`Error fetching task list: ${JSON.stringify(response)}`, [])
                self.setProp('task', [])
                markLoading(false)
                Alert.alert(response.message)
                return response
            }

            self.task = response.data.task
            markLoading(false)
            return response
        })



        return {
            loadTask,
            resetTask,
        }
    })

