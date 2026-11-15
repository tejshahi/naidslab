Nepal rises from about 60 metres above sea level in the Terai to 8,848 metres at the summit of Everest, across a country only 150–250 kilometres wide from south to north. That makes it one of the hardest places on Earth to map from space, and one of the places that would gain most from doing it well. This post sets out why a **foundational GeoAI model for the Sustainable Development Goals (SDGs)** sits at the heart of our flagship programme, explainable GeoAI for Earth observation.

## The problem: models that don't travel

Free satellite missions such as **Sentinel-1**, **Sentinel-2** and **Landsat** image every part of Nepal every few days. But most land-cover and crop models are trained on flat, well-labelled landscapes in Europe, North America or China. In Nepal they meet:

- steep terrain that casts long shadows,
- monsoon cloud that hides the ground for months,
- small, mixed fields, often only a few pixels across, and
- very few labelled field samples to train or test on.

## The idea: pre-train once, adapt many times

A **geospatial foundation model** learns general patterns from large amounts of *unlabelled* imagery, such as how a rice paddy changes through the season or how a forest edge looks under cloud. It can then be fine-tuned for a specific task with only a small number of local labels. One model could support many SDG indicators:

| SDG | Example task |
|---|---|
| 2 Zero hunger | Crop type and crop condition mapping |
| 6 Clean water | Surface water and irrigation mapping |
| 11 Sustainable cities | Urban expansion around Kathmandu, Pokhara and the Terai |
| 13 Climate action | Glacial lakes, floods and landslide mapping |
| 15 Life on land | Forest and rangeland condition |

## What we have already shown

The programme builds directly on the founder's published work:

- **Fusing sensors.** A deep-learning framework that fuses Landsat 8 and Sentinel-2 NDVI to produce consistent time series (Mishra & Shahi, *Journal of Applied Remote Sensing*, 2021).
- **Learning without labels.** Pasture types mapped from multi-temporal Sentinel-2 imagery by object-based clustering, reaching normalised mutual information of 86–88% against reference data over about 2,510 ha, with no labelled training data (Shahi et al., *Remote Sensing*, 2025). The code is [open on GitHub](https://github.com/tejshahi/OBIA-clusters-v2).
- **Knowing the field.** Reviews of spatial deep learning (2022) and of pasture monitoring with remote sensing and machine learning (2025).

![Quick-shift segments over satellite imagery, the first step of object-based pasture mapping (Shahi et al., Remote Sensing, 2025, CC BY)](assets/img/research/pasture-segments.jpg)

## Our research agenda

1. Assemble a multi-sensor, multi-year image archive covering the Terai, hills and mountains.
2. Pre-train a foundation model with self-supervised learning, designed for terrain and cloud.
3. Build **open Nepal benchmarks** for crop type, rangeland, forest, urban, water and hazard mapping.
4. Develop label-efficient adaptation: clustering, few-shot and active learning.
5. Co-design SDG indicator maps and dashboards with government, NGO and university partners.

## Work with us

We are looking for partners who hold field data, work on land, water or climate in Nepal, or fund open geospatial research. [Get in touch](#contact) to discuss a collaboration or a joint grant application.
