import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

interface Question {
  _id: string;
  text: string;
  type: string; // "Text" | "CheckBox" | ...
  options?: string[];
}

interface Form {
  _id: string;
  title: string;
  headerImage?: string;
  questions: Question[];
}

interface FormPreviewProps {
  formId: string;
}

const FormPreview: React.FC<FormPreviewProps> = ({ formId }) => {
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {}
  );

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get<Form>(
          `http://localhost:5000/api/forms/${formId}`
        );
        setForm(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch form.");
      }
    };
    fetchForm();
  }, [formId]);

  const submitResponses = async () => {
    try {
      await axios.post(`http://localhost:5000/api/forms/${formId}/response`, {
        answers: responses,
      });
      Alert.alert("Success", "Responses submitted!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit responses.");
    }
  };

  const updateResponse = (questionId: string, answer: string | string[]) => {
    setResponses({ ...responses, [questionId]: answer });
  };

  if (!form) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {form.headerImage && (
        <Text style={styles.headerImage}>Header Image: {form.headerImage}</Text>
      )}
      <Text style={styles.title}>{form.title}</Text>

      <FlatList
        data={form.questions}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{item.text}</Text>
            {item.type === "Text" ? (
              <TextInput
                placeholder="Your Answer"
                onChangeText={(text) => updateResponse(item._id, text)}
                style={styles.input}
              />
            ) : item.type === "CheckBox" && item.options ? (
              item.options.map((option) => (
                <View key={option} style={styles.checkboxContainer}>
                  <Switch
                    value={
                      Array.isArray(responses[item._id]) &&
                      (responses[item._id] as string[]).includes(option)
                    }
                    onValueChange={(isChecked) => {
                      const currentResponses = responses[item._id] as
                        | string[]
                        | undefined;
                      updateResponse(
                        item._id,
                        isChecked
                          ? [...(currentResponses || []), option]
                          : (currentResponses || []).filter((o) => o !== option)
                      );
                    }}
                  />
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              ))
            ) : null}
          </View>
        )}
      />
      <TouchableOpacity style={styles.submitButton} onPress={submitResponses}>
        <Text style={styles.submitButtonText}>Submit Responses</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
    textAlign: "center",
  },
  headerImage: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  optionText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default FormPreview;
