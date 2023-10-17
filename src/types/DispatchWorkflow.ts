import { WorkflowInputs } from './WorkflowInputs.js'

export type DispatchWorkflow = (inputs?: WorkflowInputs) => Promise<void>
