import { useAuth } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { Body, Caption, Heading, Screen, Title } from "@/components/Themed";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { jarvisStrings as s } from "@/constants/jarvis-strings";
import { useColors } from "@/hooks/useColors";
import { routeCommand } from "@/lib/jarvis-intents";
import {
  useGetFeatured,
  useListMyHistory,
  useListScriptures,
  useListTraditions,
  useListUnityQuotes,
} from "@workspace/api-client-react";

export default function JarvisScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const traditions = useListTraditions();
  const scriptures = useListScriptures();
  const featured = useGetFeatured();
  const quotes = useListUnityQuotes();
  const history = useListMyHistory({
    query: { enabled: !!isSignedIn } as never,
  });

  const [command, setCommand] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  function run(input: string) {
    const route = routeCommand(input, {
      traditions: traditions.data,
      scriptures: scriptures.data,
    });
    if (route.intent === "health") {
      setReply(s.health);
      return;
    }
    if (!route.href) {
      setReply(s.unknown);
      return;
    }
    setReply(null);
    router.push(route.href as never);
  }

  const lastPlayed = isSignedIn ? history.data?.[0] : undefined;
  const topFeatured = featured.data?.[0];
  const quote = quotes.data?.length
    ? quotes.data[new Date().getDate() % quotes.data.length]
    : undefined;

  const card = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: colors.radius,
    },
  ];

  return (
    <Screen>
      <KeyboardAwareScrollViewCompat
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      >
        <View>
          <Caption>{s.caption}</Caption>
          <Title style={{ marginTop: 12 }}>{s.title}</Title>
          <Body
            style={{
              marginTop: 10,
              color: colors.mutedForeground,
              fontSize: 14,
              lineHeight: 21,
            }}
          >
            {s.subtitle}
          </Body>
        </View>

        {/* Command bar */}
        <View>
          <View style={styles.inputRow}>
            <TextInput
              value={command}
              onChangeText={setCommand}
              onSubmitEditing={() => command.trim() && run(command)}
              placeholder={s.inputPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={s.inputLabel}
              returnKeyType="go"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            />
            <Pressable
              onPress={() => command.trim() && run(command)}
              accessibilityRole="button"
              accessibilityLabel={s.submit}
              style={({ pressed }) => [
                styles.go,
                {
                  backgroundColor: colors.primary,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Body
                style={{
                  color: colors.primaryForeground,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                {s.submit}
              </Body>
            </Pressable>
          </View>
          <Body
            style={{
              marginTop: 8,
              color: colors.mutedForeground,
              fontSize: 12,
              lineHeight: 17,
            }}
          >
            {s.privacy}
          </Body>
          {reply && (
            <Body
              accessibilityLiveRegion="polite"
              style={{
                marginTop: 12,
                color: colors.foreground,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {reply}
            </Body>
          )}
        </View>

        {/* Suggestion chips */}
        <View>
          <Caption style={{ marginBottom: 10 }}>{s.suggestionsHeading}</Caption>
          <View style={styles.chips}>
            {s.suggestions.map((chip) => (
              <Pressable
                key={chip}
                onPress={() => {
                  setCommand(chip);
                  run(chip);
                }}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Body
                  style={{
                    color: colors.foreground,
                    fontSize: 13,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  {chip}
                </Body>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Briefing from existing catalog + listener endpoints */}
        {(lastPlayed || topFeatured || quote) && (
          <View style={{ gap: 12 }}>
            <Caption>{s.briefingHeading}</Caption>
            {lastPlayed && (
              <Pressable
                onPress={() => router.push(`/listen/${lastPlayed.chapterId}` as never)}
                accessibilityRole="button"
                style={({ pressed }) => [...card, { opacity: pressed ? 0.85 : 1 }]}
              >
                <Caption>{s.briefingContinue}</Caption>
                <Heading style={{ fontSize: 17, marginTop: 8 }}>
                  {lastPlayed.scriptureName}
                </Heading>
                <Body style={{ color: colors.mutedForeground, fontSize: 13 }}>
                  {s.chapter(lastPlayed.chapterNumber, lastPlayed.chapterTitle)}
                </Body>
              </Pressable>
            )}
            {topFeatured && (
              <Pressable
                onPress={() => router.push(`/scripture/${topFeatured.scriptureId}` as never)}
                accessibilityRole="button"
                style={({ pressed }) => [...card, { opacity: pressed ? 0.85 : 1 }]}
              >
                <Caption>{s.briefingFeatured}</Caption>
                <Body
                  style={{
                    marginTop: 8,
                    fontFamily: "PlayfairDisplay_500Medium",
                    fontSize: 16,
                    lineHeight: 24,
                    color: colors.foreground,
                  }}
                >
                  {topFeatured.tagline}
                </Body>
                <Body style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 6 }}>
                  {topFeatured.traditionName} · {topFeatured.scriptureName}
                </Body>
              </Pressable>
            )}
            {quote && (
              <Pressable
                onPress={() => router.push("/unity" as never)}
                accessibilityRole="button"
                style={({ pressed }) => [...card, { opacity: pressed ? 0.85 : 1 }]}
              >
                <Caption>{s.briefingQuote}</Caption>
                <Body
                  style={{
                    marginTop: 8,
                    fontFamily: "PlayfairDisplay_500Medium",
                    fontSize: 16,
                    lineHeight: 24,
                    color: colors.foreground,
                  }}
                >
                  “{quote.quote}”
                </Body>
                <Body style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 6 }}>
                  {quote.attribution} · {quote.traditionName}
                </Body>
              </Pressable>
            )}
          </View>
        )}

        {/* Skills grid — existing screens only */}
        <View>
          <Caption style={{ marginBottom: 10 }}>{s.skillsHeading}</Caption>
          <View style={styles.grid}>
            {s.skills.map((skill) => (
              <Pressable
                key={skill.href}
                onPress={() => router.push(skill.href as never)}
                accessibilityRole="button"
                accessibilityLabel={`${skill.label}: ${skill.description}`}
                style={({ pressed }) => [
                  ...card,
                  styles.gridItem,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Feather name={skill.icon} size={18} color={colors.primary} />
                <Heading style={{ fontSize: 15, marginTop: 8 }}>{skill.label}</Heading>
                <Body style={{ color: colors.mutedForeground, fontSize: 12, lineHeight: 17 }}>
                  {skill.description}
                </Body>
              </Pressable>
            ))}
          </View>
        </View>

        <Body
          style={{
            color: colors.mutedForeground,
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {s.licensing}
        </Body>
      </KeyboardAwareScrollViewCompat>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 60,
    gap: 24,
  },
  inputRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
  },
  go: {
    minWidth: 56,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  card: {
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridItem: { width: "48%" },
});
