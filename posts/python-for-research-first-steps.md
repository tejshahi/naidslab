Many researchers still analyse data by hand in spreadsheets. It works, until you need to repeat the analysis, fix an error or explain exactly what you did. **Python** makes analysis repeatable and transparent. Here are five first steps.

## 1. Install a friendly environment

Install **Anaconda** or **Miniconda**, then work in **Jupyter notebooks** or **VS Code**. Notebooks let you mix code, results and notes in one document.

## 2. Load your data with pandas

```python
import pandas as pd
df = pd.read_csv("survey.csv")
df.head()
```

## 3. Clean before you analyse

Check missing values, fix data types and rename columns clearly. Keep the cleaning steps in code so anyone can rerun them.

## 4. Summarise and visualise

```python
df.describe()
df["district"].value_counts().plot(kind="bar")
```

## 5. Keep your work reproducible

Save notebooks with clear names, record package versions and keep raw data unchanged. Your future self, and your reviewers, will thank you.

---

Want structured, hands-on practice? Our **Python for Research and Data Science** course covers all of this and more over four to six weeks. See [Training](#training).
