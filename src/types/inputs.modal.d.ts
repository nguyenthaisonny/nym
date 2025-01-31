interface itemInput {
    label?: string
    name?: string
    rules?: rule[]
    type?: 'password' | 'text'
    hasFeedback?: boolean
}
interface ruleItemInput {
    required?: boolean
    message?: string
}