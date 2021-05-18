<template>
  <div>
    <v-container fluid>
      <v-row align-content="start" justify="start">
        <v-col cols="12">
          <v-card>
            <v-card-title>Settings</v-card-title>
            <v-card-text
              ><v-list>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-subtitle>Application version</v-list-item-subtitle>
                    <v-list-item-title>{{ version }}</v-list-item-title>
                  </v-list-item-content> </v-list-item
                ><v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-subtitle>Server</v-list-item-subtitle>
                    <v-list-item-title>{{ server }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-subtitle>Scanning</v-list-item-subtitle>
                    <v-list-item-title>
                      {{ scanning }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line v-if="scanStatus.count > 0">
                  <v-list-item-content>
                    <v-list-item-subtitle>Songs</v-list-item-subtitle>
                    <v-list-item-title>
                      {{ scanStatus.count }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list></v-card-text
            >
            <v-card-actions>
              <v-btn color="primary" @click="scan" :disabled="scanStatus.scanning" :loading="scanStatus.scanning"
                >Scan library</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { server } from "@/store/modules/server";
import { ScanStatus } from "@/store/interfaces/scanStatus";

@Component({
  name: "Settings",
})
export default class Albums extends Vue {
  @server.Getter server!: string;
  @server.State scanStatus!: ScanStatus;
  @server.Action startScan!: () => Promise<ScanStatus>;
  @server.Action getScanStatus!: () => Promise<ScanStatus>;
  async mounted(): Promise<void> {
    if (this.scanStatus.count === 0) {
      await this.getScanStatus();
    }
  }

  get scanning(): string {
    return this.scanStatus?.scanning ? "Yes" : "No";
  }

  get version(): string {
    return process.env.VUE_APP_VERSION || "";
  }

  async scan(): Promise<void> {
    await this.startScan();
    this.checkScan();
  }

  checkScan(): void {
    if (this.scanStatus?.scanning) {
      setTimeout(async () => {
        await this.getScanStatus();
        this.checkScan();
      }, 1000);
    }
  }
}
</script>
