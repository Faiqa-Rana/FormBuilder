import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import FormEditor from "@/components/FormEditor"; // Adjust path if necessary
import FormPreview from "@/components/FormPreview"; // Adjust path if necessary
import axios from "axios";

export default function App() {
  const [currentView, setCurrentView] = useState<"editor" | "preview">(
    "editor"
  );
  const [forms, setForms] = useState<any[]>([]); // Holds all the forms
  const [formId, setFormId] = useState<string | null>(
    "676568c06b198aa501ab013c"
  ); // Default formId

  // Animated circles setup
  const animatedScale1 = useState(new Animated.Value(1))[0];
  const animatedScale2 = useState(new Animated.Value(0.5))[0];

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/forms");
        setForms(response.data); // Store all forms in state
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
    fetchForms();

    // Animate circles
    const animateCircles = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedScale1, {
            toValue: 1.5,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedScale1, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedScale2, {
            toValue: 1.5,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animatedScale2, {
            toValue: 0.5,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateCircles();
  }, []);

  const toggleView = () => {
    setCurrentView(currentView === "editor" ? "preview" : "editor");
  };

  const selectForm = (id: string) => {
    setFormId(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Background Circles */}
      <Animated.View
        style={[
          styles.animatedCircle,
          { transform: [{ scale: animatedScale1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.animatedCircle2,
          { transform: [{ scale: animatedScale2 }] },
        ]}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>
          {currentView === "editor" ? "Form Editor" : "Form Preview"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {currentView === "editor" ? (
          <View style={styles.editorContainer}>
            <FormEditor />
            <TouchableOpacity style={styles.button} onPress={toggleView}>
              <Text style={styles.buttonText}>Go to Preview</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.previewContainer}>
            {formId ? (
              <FormPreview formId={formId} />
            ) : (
              <Text style={styles.noFormText}>
                No form selected for preview
              </Text>
            )}
            <TouchableOpacity style={styles.button} onPress={toggleView}>
              <Text style={styles.buttonText}>Go to Editor</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Form List Preview */}
        <View style={styles.formListContainer}>
          <Text style={styles.formListTitle}>Available Forms</Text>
          <FlatList
            data={forms}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.formItem}
                onPress={() => selectForm(item._id)}
              >
                <Text style={styles.formItemText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6fc", // Soft light background color
    paddingHorizontal: 16,
    paddingVertical: 20,
    position: "relative", // Needed for background circles to be positioned absolutely
  },
  animatedCircle: {
    position: "absolute",
    top: "20%",
    left: "10%",
    width: 200,
    height: 200,
    backgroundColor: "#f39c12",
    borderRadius: 100,
    opacity: 0.3,
  },
  animatedCircle2: {
    position: "absolute",
    top: "50%",
    left: "30%",
    width: 150,
    height: 150,
    backgroundColor: "#e74c3c",
    borderRadius: 75,
    opacity: 0.3,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  scrollContainer: {
    flexGrow: 1, // Ensures content takes full height and is scrollable
    justifyContent: "flex-start",
  },
  editorContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  previewContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#f39c12",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold", // Bold text
  },
  noFormText: {
    color: "#95a5a6",
    fontSize: 16,
    fontStyle: "italic",
  },
  formListContainer: {
    marginTop: 20,
    paddingBottom: 10,
  },
  formListTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2c3e50",
  },
  formItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  formItemText: {
    fontSize: 16,
    color: "#e74c3c",
    // color: "#2980b9",
  },
});
