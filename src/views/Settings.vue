<template>
  <div>
    <v-container fluid>
      <v-row dense align-content="start" justify="start">
        <v-col cols="12">
          <v-card>
            <v-card-title>Settings</v-card-title>
            <v-card-text
              ><v-list>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-subtitle>Server</v-list-item-subtitle>
                    <v-list-item-title>{{ server }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item two-line>
                  <v-list-item-content>
                    <v-list-item-subtitle>Scanning</v-list-item-subtitle>
                    <v-list-item-title>{{ scanning }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list></v-card-text
            >
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
  @server.State scanStatus: ScanStatus | undefined;
  @server.Action getScanStatus!: () => Promise<ScanStatus>;
  async mounted(): Promise<void> {
    // implement
    if (!this.scanStatus) {
      await this.getScanStatus();
    }
  }

  get scanning(): string {
    return this.scanStatus?.scanning ? "Yes" : "No";
  }
}
</script>
