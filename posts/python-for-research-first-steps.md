The best way to learn Python for research is to answer a real question with real data. In this tutorial we use **NepEMO**, an open dataset of 4,462 Nepali Reddit posts labelled for five emotions, released with our 2025 paper. You will load the data, summarise it and draw a chart of six years of trends, in about 20 lines of code.

## 1. Set up

Install **Anaconda** or **Miniconda**, then open a **Jupyter notebook** or **VS Code**. You need two packages, `pandas` and `matplotlib`, which Anaconda already includes.

## 2. Load the data straight from GitHub

```python
import pandas as pd

url = ("https://raw.githubusercontent.com/tejshahi/"
       "Nepali-Reddit-NepEMO-/main/labeled_dataset.csv")
df = pd.read_csv(url)
df.shape        # (4462, 15)
```

Each row is a post. The columns `Fear`, `Anger`, `Sadness`, `Joy` and `Depression` hold `1` if annotators found that emotion in the post and `0` if not. A post can carry several emotions at once.

## 3. Summarise

Because the labels are 0 or 1, the **mean** of a column is the share of posts with that emotion:

```python
emotions = ["Fear", "Anger", "Sadness", "Joy", "Depression"]
(df[emotions].mean() * 100).round(1).sort_values(ascending=False)
```

| Emotion | Share of posts |
|---|---|
| Sadness | 39.1% |
| Fear | 36.4% |
| Anger | 30.7% |
| Joy | 26.8% |
| Depression | 21.3% |

## 4. Work with dates

```python
df["created"] = pd.to_datetime(df["created"], format="%m/%d/%Y %H:%M")
df["year"] = df["created"].dt.year
yearly = df.groupby("year")[emotions].mean().mul(100).round(1)
yearly
```

Two patterns stand out. Sadness was the most common emotion in every year except 2020, when fear was slightly ahead, and it peaked in 2023, when half of all posts (50.4%) carried it. Depression fell from 29.8% in 2019 to 14.0% in 2021, then rose to 33.5% in 2023.

A quick check of how emotions travel together is one line:

```python
df[emotions].corr().round(2)
```

Sadness and depression go together most often (correlation 0.62), followed by fear and sadness (0.53). Joy is negatively correlated with all four other emotions.

## 5. Plot it

```python
import matplotlib.pyplot as plt

ax = yearly.plot(marker="o", figsize=(10, 6))
ax.set_ylabel("Share of posts (%)")
ax.set_title("Emotion trends in Nepali Reddit, 2019–2025")
plt.savefig("nepemo-trends.png", dpi=150, bbox_inches="tight")
```

With a little styling, the same data gives this chart:

![Line chart of the share of NepEMO posts carrying each of five emotions, 2019 to 2025](assets/img/research/nepemo-trends.png)

Note that the data for 2025 cover January to June only, and the number of posts per year varies (from 191 in 2019 to 908 in 2022). Always report counts alongside percentages.

## Keep it reproducible

Save the notebook, keep the raw CSV unchanged, and record your package versions with `pip freeze > requirements.txt`. Anyone, including your reviewers, can then rerun every number in this post.

---

**Cite the data:** Sitoula, S., Shahi, T. B., Bhatt, L. P., Pokhrel, A., & Neupane, A. (2025). *NepEMO: A multi-label emotion and sentiment analysis on Nepali Reddit with linguistic insights and temporal trends.* arXiv:2512.22823.

Want structured, hands-on practice? Our **Python for Research and Data Science** course covers all of this and more over four to six weeks. See [Training](#training).
