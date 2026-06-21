export const changePlanByUserId = async (userId, newPlan) => {
    const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/change-plan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newPlan }),
    });

    if (!result.ok) {
        throw new Error('Failed to change plan');
    }

    return result.json();
};