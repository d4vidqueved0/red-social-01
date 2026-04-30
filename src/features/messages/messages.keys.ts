export const chatKeys = {
    all: ['chat'] as const,
    chat: (idChat: string | undefined) => [...chatKeys.all, idChat]
}