try {
    const result = await someApiCall();
    return result;
} catch (error) {
    console.error(error);
    throw new Error('Something went wrong');
}
