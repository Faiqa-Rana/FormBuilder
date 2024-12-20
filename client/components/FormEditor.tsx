import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";

// Define types for question and form
type Question = {
  type: "Text" | "Grid" | "CheckBox";
  text: string;
  options: string[];
  image: string;
};

type Form = {
  title: string;
  headerImage: string;
  questions: Question[];
};

const FormEditor: React.FC = () => {
  const [form, setForm] = useState<Form>({
    title: "",
    headerImage: "",
    questions: [],
  });

  // Function to add a question
  const addQuestion = (type: Question["type"]) => {
    setForm((prevForm) => ({
      ...prevForm,
      questions: [
        ...prevForm.questions,
        { type, text: "", options: [], image: "" },
      ],
    }));
  };

  // Function to update a specific question
  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    setForm((prevForm) => {
      const updatedQuestions = [...prevForm.questions];
      updatedQuestions[index][field] = value;
      return { ...prevForm, questions: updatedQuestions };
    });
  };

  // Function to save the form
  const saveForm = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/forms/create",
        form
      ); // Replace with your backend URL
      Alert.alert("Success", `Form saved! ID: ${response.data._id}`);
      setForm({ title: "", headerImage: "", questions: [] }); // Reset form
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save form.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Get Started!</Text>

      {/* Input for form title */}
      <TextInput
        placeholder="Form Title"
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
        style={styles.input}
      />

      {/* Input for header image */}
      <TextInput
        placeholder="Header Image URL"
        value={form.headerImage}
        onChangeText={(text) => setForm({ ...form, headerImage: text })}
        style={styles.input}
      />

      {/* Buttons to add different question types */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addQuestion("Text")}
        >
          <Text style={styles.buttonText}>Add Text Question</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addQuestion("Grid")}
        >
          <Text style={styles.buttonText}>Add Grid Question</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => addQuestion("CheckBox")}
        >
          <Text style={styles.buttonText}>Add CheckBox Question</Text>
        </TouchableOpacity>
      </View>

      {/* List of questions */}
      <FlatList
        data={form.questions}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Type: {item.type}</Text>

            {/* Input for question text */}
            <TextInput
              placeholder="Question Text"
              value={item.text}
              onChangeText={(text) => updateQuestion(index, "text", text)}
              style={styles.input}
            />

            {/* Input for options if question type is CheckBox or Grid */}
            {(item.type === "CheckBox" || item.type === "Grid") && (
              <TextInput
                placeholder="Options (comma separated)"
                value={item.options.join(",")}
                onChangeText={(text) =>
                  updateQuestion(index, "options", text.split(","))
                }
                style={styles.input}
              />
            )}
          </View>
        )}
      />

      {/* Button to save the form */}
      <TouchableOpacity style={styles.saveButton} onPress={saveForm}>
        <Text style={styles.saveButtonText}>Save Form</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default FormEditor;
