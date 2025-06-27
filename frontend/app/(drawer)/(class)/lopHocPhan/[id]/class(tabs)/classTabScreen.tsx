import { Redirect, useLocalSearchParams } from "expo-router";

export default function ClassTabScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    if (!id) return null;

    return <Redirect href={`../classTabs/dashboard`} />;
}
