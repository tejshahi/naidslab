Satellites see whole districts; drones see individual plants. For Nepal's small, terraced and mixed farms, that difference matters. Over the past five years, HIDI's founder and his collaborators have tested how far **unmanned aerial vehicles (UAVs)** and machine learning can go in spotting crop problems early. Here is what we found, and what we plan next.

## What the evidence says

**Deep learning usually beats older methods, but needs data.** Our systematic review of 55 studies on UAVs and deep learning for crop disease detection found that deep-learning models generally reported higher accuracy than statistical and classical machine-learning methods. RGB cameras were most often paired with deep learning, multispectral sensors with classical machine learning, and about three-quarters of the studies dealt with fungal diseases (Shahi et al., *Remote Sensing*, 2023).

**Weeds can be mapped plant by plant.** Using 201 UAV images of a cotton field, a UNet model with an EfficientNetB0 backbone reached an F1-score of 88% for multi-class weed segmentation. The hardest weed to separate, Johnson grass, shows how much class imbalance still limits these models (Shahi et al., *Drones*, 2023).

![UAV image of cotton rows with weeds between them (Shahi et al., Drones, 2023, CC BY)](assets/img/research/uav-cotton-field.jpg)

**Disease severity can be estimated before it is visible to the eye.** In peanut breeding trials in Queensland, vegetation indices from a five-band multispectral camera estimated late leaf spot severity with R² up to about 0.79 using a cooperative scheme that picks the best statistic for each index (Shahi et al., *PLOS ONE*, 2023). A companion study used the same approach to predict yield (*Electronic Research Archive*, 2023).

**Leaves tell you about water.** A deep-learning model detected the irrigation status of tomato plants from images of their leaves (Shahi et al., *IEEE Transactions on Artificial Intelligence*, 2025).

## What still stands in the way

- **Labels.** Most models need thousands of annotated images, and Nepal has very few.
- **Transfer.** A model trained in Greece or Queensland may fail on a hill farm in Kavre.
- **Cost and skills.** Multispectral cameras and processing software remain expensive.

## What HIDI will do

1. Build open, labelled UAV datasets for Nepal's main crops with farmers and agricultural colleges.
2. Develop lightweight models that run on a phone or on the drone itself.
3. Link drone surveys with satellite imagery so that a few flights can calibrate district-scale maps, connecting this programme with our [GeoAI flagship](#research).
4. Publish simple flight and data protocols that extension workers can follow.

If you work with farmers, cooperatives or agricultural research stations in Nepal, [we would like to hear from you](#contact).
